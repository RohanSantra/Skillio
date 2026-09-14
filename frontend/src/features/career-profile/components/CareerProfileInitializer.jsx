import { useEffect } from "react";

import useAuthStore from "../../auth/store/auth.store";

import useCareerProfile from "../hooks/useCareerProfile";


export default function CareerProfileInitializer({

    children,

}) {


    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );


    const isInitializing = useAuthStore(
        (state) => state.isInitializing
    );


    const {
        fetchCareerProfile
    } = useCareerProfile();


    useEffect(() => {

        if (isInitializing) {
            return;
        }



        const initializeCareerProfile = async () => {

            try {

                await fetchCareerProfile();

            } catch (error) {

                console.error(
                    "Career profile initialization failed:",
                    error
                );

            }

        };


        initializeCareerProfile();


    }, [
        isAuthenticated,
        isInitializing,
        fetchCareerProfile,
    ]);


    return children;

}