import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const HomePage = async () => {redirect("/home/dashboard");};

export default HomePage;