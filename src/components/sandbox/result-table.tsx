'use client';

interface ResultTableProps {
    data: any[];
}

export function ResultTable({ data }: ResultTableProps) {
    if (!data || data.length === 0) {
        return (
            <p className="text-muted-foreground">Запрос не вернул данных.</p>
        );
    }

    const headers = Object.keys(data[0]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} scope="col" className="px-6 py-3">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="bg-white border-b hover:bg-gray-50 "
                        >
                            {headers.map((header) => (
                                <td
                                    key={`${rowIndex}-${header}`}
                                    className="px-6 py-4"
                                >
                                    {String(row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
