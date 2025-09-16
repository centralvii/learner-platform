-- CreateTable
CREATE TABLE "public"."sandbox_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "initial_code" TEXT,
    "solution" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sandbox_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sandbox_submissions" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sandbox_submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."sandbox_submissions" ADD CONSTRAINT "sandbox_submissions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."sandbox_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
