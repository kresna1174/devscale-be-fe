import { useProfile } from "../hooks/useProfile"
import { Loader } from "lucide-react"

export const Profile = () => {
    const {data, isPending} = useProfile()
    if (isPending) {
        return <Loader className="animate-spin"/>
    }
    return (
        <div>
            <div className="font-semibold tracking-tighter">{data?.data.email}</div>
        </div>
    )
}