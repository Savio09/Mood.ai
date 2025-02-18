import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
  const user = await getUserByClerkID()
  const analyses = await prisma.analysis.findMany({
    where:
  })
};

const History = () => {
  return (
    <div>
      <h1>This is the history page!</h1>
    </div>
  );
};

export default History;
