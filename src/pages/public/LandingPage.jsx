import Header from "./Header"
import Footer from "./Footer"
import Main from "./Main"

const LandingPage = () => {
  return (
    <section className="flex flex-col">
      <Header/>
      <Main/>
      <Footer/>
    </section>
  )
}

export default LandingPage