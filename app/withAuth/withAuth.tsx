// import {useSession} from "next-auth/react";
// import {usePathname, useRouter} from "next/navigation";
// import React from 'react';
// import {SESSION_STORAGE_KEY} from "@/components/common/const";

// const WithAuth = ({children}: { children: React.ReactNode }) => {
//     const {data: session, status} = useSession();
//     const router = useRouter();
//     const pathname = usePathname();

//     if (status === 'loading') {
//         return <p>Loading...</p>;
//     }

//     if (!session) {
//         sessionStorage.setItem(SESSION_STORAGE_KEY.REDIRECT_PATH, pathname!);
//         router.push('/login');
//         return null;
//     }

//     return <>{children}</>;
// };

// export default WithAuth;