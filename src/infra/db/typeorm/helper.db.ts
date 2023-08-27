import { TableColumnOptions } from "typeorm";

export const withTimestamps = () =>
  <TableColumnOptions[]>[
    {
      name: "createdAt",
      type: "timestamp",
      isNullable: false,
      default: "now()",
    },
    {
      name: "updatedAt",
      type: "timestamp",
      isNullable: false,
      default: "now()",
    },
  ];

export const withSoftDelete = () =>
  <TableColumnOptions[]>[
    {
      name: "deletedAt",
      type: "timestamp",
      isNullable: true,
      default: null,
    },
  ];
