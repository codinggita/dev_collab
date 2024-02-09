import { INewUser } from '@/types';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import { createUserAccount, signInAccount } from '../appwrite/api';

// We have initialized a new mutation function so that now ReactQuery also knows what we are doing
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}


// For sign-in the account
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user),
    })
}