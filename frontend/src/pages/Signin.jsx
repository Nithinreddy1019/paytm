import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";

export function Signin(){
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"}/>
                    <InputBox label={"Email"} placeholder={"JohnDoe@gmail.com"}></InputBox>
                    <InputBox label={"Password"} placeholder={"123456"}></InputBox>
                    <div className="pt-4">
                        <Button label={"Sign in"}></Button>
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}></BottomWarning>
                </div>
            </div>
        </div>
    )
}