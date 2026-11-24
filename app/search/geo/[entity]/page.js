import { Suspense } from "react";

import GeoEntityList from "@/app/components/ServerSide/GeoEntityList/GeoEntityList";
import Loading from "@/app/loading";

export default function GeoSearch({ searchParams, params }) {
  const key = JSON.stringify(searchParams);

  return (
    <Suspense fallback={<Loading />} key={key}>
      <GeoEntityList searchParams={searchParams} entity={params.entity} />
    </Suspense>
  );
}
