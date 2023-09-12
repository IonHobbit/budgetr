export type Route = {
  url: string;
  name: string;
  icon: string;
  altIcon?: string;
  description?: string;
  custodianOnly?: boolean;
};

const routes: Route[] = [
  {
    url: "/",
    name: "Dashboard",
    icon: "bxs:dashboard",
  },
  {
    url: "/transactions",
    name: "Transactions",
    icon: "icon-park-solid:transaction-order",
  },
  {
    url: "/accounts",
    name: "Accounts",
    icon: "mingcute:bank-card-line",
  },
  {
    url: "/budgets",
    name: "Budgets",
    icon: "tabler:currency-naira",
  },
  {
    url: "/root",
    name: "Root",
    icon: "solar:tornado-small-bold-duotone",
    custodianOnly: true
  },
];

export const civilianRoutes = routes.filter((route) => !route.custodianOnly)

export default routes;