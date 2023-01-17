export const userRecords = localStorage.getItem("records")
  ? JSON.parse(localStorage.getItem("records"))
  : [];

export const addRecord = ({ user, score, records }) => {
  localStorage.setItem("records", JSON.stringify([{ user, score, records }, ...userRecords]));
};