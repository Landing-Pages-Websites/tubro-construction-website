export type SubmissionLock = { acquire: () => boolean; release: () => void; complete: () => void };

export function createSubmissionLock(): SubmissionLock {
  let pending = false;
  let succeeded = false;
  return {
    acquire: () => { if (pending || succeeded) return false; pending = true; return true; },
    release: () => { pending = false; },
    complete: () => { succeeded = true; pending = false; },
  };
}
