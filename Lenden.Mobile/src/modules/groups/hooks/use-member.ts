// useMembers.ts
import { useMemo } from "react";

export const useMembers = (members: any[]) => {
  const memberMap = useMemo(() => {
    return new Map(members.map((m) => [m.id, m]));
  }, [members]);

  const getMember = (
    id: string,
  ): { givenName: string; familyName: string; avatar: string } => {
    const memberObject = memberMap.get(id) ?? {
      givenName: "Unknown",
      familyName: "User",
      avatar: "",
    };
    return memberObject;
  };

  return { getMember };
};
