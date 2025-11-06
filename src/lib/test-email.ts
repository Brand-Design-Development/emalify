import { sendNewLeadNotification } from "./email";

async function main() {
  const receiverEmail = "phidelalivin@gmail.com";
  const now = new Date();
  const lead = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    company: "Example Corp",
    currentPosition: "Software Engineer",
    submissionDate: new Date(),
    label: "High Budget Lead",
    progress: "Form Submitted",
    id: "lead_123456",
    createdAt: now,
    updatedAt: now,
  };

  await sendNewLeadNotification(lead, [receiverEmail]);
}

await main();
