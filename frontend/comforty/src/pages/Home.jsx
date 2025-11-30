import Featured from "../components/Featured";
import Footer from "../components/fotter";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Our_Products from "../components/Our_Products";
import Testimonials from "../components/Testimonials";
import TopCategories from "../components/TopCategories";

function Home() {
  return (
    <>
      <Navbar />
      <Header/>
      <Featured/>
      <TopCategories/>
      <Our_Products/>
      <Testimonials/>
      <Footer/>

       
    </>
  )
    
    
}

export default Home;