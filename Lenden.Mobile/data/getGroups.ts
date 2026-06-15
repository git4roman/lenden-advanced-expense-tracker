import { IGroup } from "@/src/modules/groups/types/group-slice.type";

export const mockData: IGroup[] = [
  {
    id: "2bb0ceca-81f8-4494-9f50-3b2630550ec7",
    name: "Shivapuri ko Peak",
    coverPhoto:
      "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.ecoholidaysnepal.com%2Fshivapuri-day-hiking&ved=0CBYQjRxqFwoTCOi4v636iJUDFQAAAAAdAAAAABAF&opi=89978449",
    members: [
      {
        id: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        givenName: "Roman",
        familyName: "Khatri",
        avatar:
          "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
        email: "romanhelmet22@gmail.com",
        registrationStatus: "Active",
        amount: 1550.0,
        role: "Admin",
      },
      {
        id: "79ba90ba-e90c-40d0-b77f-fb029e2f73c2",
        givenName: "Helmet",
        familyName: "Admin",
        avatar: "",
        email: "roman@gmail.com",
        registrationStatus: "Active",
        amount: 2700.0,
        role: "Member",
      },
      {
        id: "d5cf0778-991c-4dcc-b072-957cc554ac83",
        givenName: "string",
        familyName: "string",
        avatar: "",
        email: "admin2@admin.com",
        registrationStatus: "Active",
        amount: -4240.0,
        role: "Member",
      },
    ],
    repayments: [
      {
        from: "d5cf0778-991c-4dcc-b072-957cc554ac83",
        to: "79ba90ba-e90c-40d0-b77f-fb029e2f73c2",
        amount: 2700.0,
      },
      {
        from: "d5cf0778-991c-4dcc-b072-957cc554ac83",
        to: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        amount: 1540.0,
      },
    ],
    memberCount: 3,
    createdAt: "2026-03-26T19:19:09.249947+00:00",
    updatedAt: "2026-06-15T09:43:59.256912+00:00",
    inviteLink: "",
  },
  {
    id: "e1f88d5c-1f88-4a5b-a2f7-824de96988c6",
    name: "Shivapuri Hike",
    coverPhoto:
      "file:///data/user/0/com.git4roman.lenden/cache/ImagePicker/38989b10-37bc-44e3-b338-17e7db62b5de.jpeg",
    members: [
      {
        id: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        givenName: "Roman",
        familyName: "Khatri",
        avatar:
          "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
        email: "romanhelmet22@gmail.com",
        registrationStatus: "Active",
        amount: 254.5,
        role: "Admin",
      },
      {
        id: "4679c181-093b-470d-b002-fd5e5c897f83",
        givenName: "Jeevan",
        familyName: "Shelby",
        avatar: "",
        email: "missing-9807083286@invalid.local",
        registrationStatus: "Active",
        amount: -113.5,
        role: "Member",
      },
      {
        id: "1beb2b67-0168-4fd4-bbee-de0f212ed7bf",
        givenName: "Nikhil",
        familyName: "Upreti",
        avatar: "",
        email: "missing-9816013113@invalid.local",
        registrationStatus: "Active",
        amount: -141.0,
        role: "Member",
      },
    ],
    repayments: [
      {
        from: "1beb2b67-0168-4fd4-bbee-de0f212ed7bf",
        to: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        amount: 141.0,
      },
      {
        from: "4679c181-093b-470d-b002-fd5e5c897f83",
        to: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        amount: 113.5,
      },
    ],
    memberCount: 3,
    createdAt: "2026-05-25T04:05:59.015672+00:00",
    updatedAt: "2026-05-25T04:05:59.015673+00:00",
    inviteLink: "",
  },
  {
    id: "98064ae2-4e25-4c93-bd0a-e1be2ab41dfe",
    name: "Dummy Shivapuri Group",
    coverPhoto:
      "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.ecoholidaysnepal.com%2Fshivapuri-day-hiking&ved=0CBYQjRxqFwoTCOi4v636iJUDFQAAAAAdAAAAABAF&opi=89978449",
    members: [
      {
        id: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        givenName: "Roman",
        familyName: "Khatri",
        avatar:
          "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
        email: "romanhelmet22@gmail.com",
        registrationStatus: "Active",
        amount: 0.0,
        role: "Admin",
      },
      {
        id: "c22d5c95-6401-46a9-97f2-21464b79dfce",
        givenName: "Roman",
        familyName: "Ghimire",
        avatar:
          "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww",
        email: "romanforgit@gmail.com",
        registrationStatus: "Active",
        amount: 0.0,
        role: "Member",
      },
      {
        id: "c8ca63ca-58fd-47a3-ad59-d7fa04a4dd7e",
        givenName: "Roman",
        familyName: "Ghimire",
        avatar: "string",
        email: "admin@admin.com",
        registrationStatus: "Active",
        amount: 0.0,
        role: "Member",
      },
    ],
    repayments: [],
    memberCount: 3,
    createdAt: "2026-06-15T09:46:39.662037+00:00",
    updatedAt: "2026-06-15T09:46:39.662066+00:00",
    inviteLink: "",
  },
  {
    id: "a6f7473e-977c-4b35-a6ae-3fd1e4dc46f9",
    name: "Check Shivapuri Group",
    coverPhoto:
      "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.ecoholidaysnepal.com%2Fshivapuri-day-hiking&ved=0CBYQjRxqFwoTCOi4v636iJUDFQAAAAAdAAAAABAF&opi=89978449",
    members: [
      {
        id: "4df6e0c4-458c-4985-8156-6a338cee7ed5",
        givenName: "Roman",
        familyName: "Khatri",
        avatar:
          "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png",
        email: "romanhelmet22@gmail.com",
        registrationStatus: "Active",
        amount: 0.0,
        role: "Admin",
      },
    ],
    repayments: [],
    memberCount: 1,
    createdAt: "2026-06-15T10:00:36.648178+00:00",
    updatedAt: "2026-06-15T10:00:36.648178+00:00",
    inviteLink: "",
  },
];
