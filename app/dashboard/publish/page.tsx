import { Suspense } from "react";
import PublishClient from "./PublishClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading publish page...</div>}>
            <PublishClient />
        </Suspense>
    );
}
