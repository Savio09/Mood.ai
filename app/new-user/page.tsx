import { prisma } from "@/utils/db";
import { ClerkLoading } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createNewUSer = async () => {
  const user = await currentUser();
  console.log(user);

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
      },
    });
  }
  redirect("/journal");
};
const NewUser = async () => {
  await createNewUSer();
  return <ClerkLoading />;
};

export default NewUser;
