import { Footer } from "@/components/Home/Footer.component";
import { HomeHeader } from "@/components/Home/Header.component";
import { HelthCare } from "@/components/Home/HelthCare.component";
import { Hero } from "@/components/Home/Hero.component";

export default function HomeTemplate() {
    return (
        <div>
            <HomeHeader />
            <Hero />
            <HelthCare />
            <Footer />
        </div>
    );
}
