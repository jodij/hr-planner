import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EmployeeForm } from "@/components/employee/employee-form"
import { EmployeeTable } from "@/components/employee/employee-table";

export default async function EmployeePage() {
    const session = await getServerSession(authOptions);
    // const data = await fetch(process.env.API_URL + '/api/v1/employees?page=1&page_size=10', {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": session.accessToken,
    //     },
    // })
    // const response = await data.json();
    return (
        <main className= "m-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Employee</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <EmployeeForm />
                </DialogContent>
            </Dialog>
            <EmployeeTable/>
        </main>
    );
};