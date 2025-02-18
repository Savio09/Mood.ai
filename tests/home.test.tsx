import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Page from "../app/page";

vi.mock("@clerk/nextjs", () => {
  return {
    auth: () => new Promise((resolve) => resolve({ userId: "" })),
    ClerkProvider: ({ children }) => <div>{children}</div>,
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: "uxwyvivwnpe",
        fullName: "Charles Dickinson",
      },
    }),
  };
});

test("Home", async () => {
  render(await HomePage());
  expect(screen.getByText("tracking your record")).toBeTruthy();
});
