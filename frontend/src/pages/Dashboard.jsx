import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export function Dashboard(){
    return (
        <div>
            <Appbar></Appbar>
            <div className="px-10 pt-5">
                <Balance></Balance>
                <Users></Users>
            </div>
        </div>
    )
}