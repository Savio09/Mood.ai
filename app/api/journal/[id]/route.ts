import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { analyze } from "@/utils/ai";
import { revalidatePath } from "next/cache";
export const PATCH = async (request, { params }) => {
  const { content } = await request.json();
  const user = await getUserByClerkID();
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  });

  let analysis;
  try {
    analysis = await analyze(updatedEntry.content);
  } catch {
    // Saving is independent of the external analysis service. Remove stale
    // analysis so the UI never associates old results with new journal text.
    await prisma.analysis.deleteMany({ where: { entryId: updatedEntry.id, userId: user.id } });
    revalidatePath("/journal");
    return NextResponse.json({ data: { ...updatedEntry, analysis: null,
      warning: "Entry saved. AI analysis is temporarily unavailable." } });
  }

  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      userId: user.id,
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: {
      ...analysis,
    },
  });
  revalidatePath("/journal");
  return NextResponse.json({ data: { ...updatedEntry, analysis: updated } });
};
