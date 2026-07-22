import type { Job, JobFormValues, JobSearchFilters } from "../types/job";

const API_URL = "http://localhost:5016/api/Jobs";

// GET recruiter jobs
export async function fetchRecruiterJobs(): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return await response.json();
}

// GET candidate jobs
export async function searchJobs(
  filters: JobSearchFilters
): Promise<Job[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const jobs: Job[] = await response.json();

  return jobs.filter((job) => {
    if (job.status !== "Open") return false;

    if (
      filters.keyword &&
      !`${job.title} ${job.skills.join(" ")}`
        .toLowerCase()
        .includes(filters.keyword.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.location &&
      !job.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.workMode.length &&
      !filters.workMode.includes(job.workMode)
    ) {
      return false;
    }

    if (
      filters.employmentType.length &&
      !filters.employmentType.includes(job.employmentType)
    ) {
      return false;
    }

    if (
      filters.experienceLevel.length &&
      !filters.experienceLevel.includes(job.experienceLevel)
    ) {
      return false;
    }

    if (
      filters.minSalary &&
      job.salary.max < filters.minSalary
    ) {
      return false;
    }

    return true;
  });
}

// POST
export async function createJob(
  values: JobFormValues
): Promise<Job> {
  const payload = {
    title: values.title,
    department: values.department,
    location: values.location,
    workMode: values.workMode,
    employmentType: values.employmentType,
    experienceLevel: values.experienceLevel,
    minSalary: values.salary.min,
    maxSalary: values.salary.max,
    currency: values.salary.currency,
    skills: values.skills,
    description: values.description,
    requirements: values.requirements,
    closingDate: values.closingDate,
    status: values.status,
    postedBy: "Recruiter"
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create job");
  }

  return await response.json();
}

// PUT
export async function updateJob(
  id: number,
  values: JobFormValues
): Promise<Job> {
  const payload = {
    id,
    title: values.title,
    department: values.department,
    location: values.location,
    workMode: values.workMode,
    employmentType: values.employmentType,
    experienceLevel: values.experienceLevel,
    minSalary: values.salary.min,
    maxSalary: values.salary.max,
    currency: values.salary.currency,
    skills: values.skills,
    description: values.description,
    requirements: values.requirements,
    closingDate: values.closingDate,
    status: values.status,
    postedBy: "Recruiter"
  };

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update job");
  }

  return await response.json();
}

// DELETE
export async function deleteJob(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete job");
  }
}