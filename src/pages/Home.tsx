import { useNavigate } from "react-router-dom";
import studentSimcom from "../../public/simcomeData.json";
import studentInmcom from "../../public/incomeData.json";
import studentGlosoft from "../../public/glosoftData.json";

function Home(){
    const navigate = useNavigate();

    return(
        <div>
            <button onClick={() => navigate("/checker", {state : studentSimcom})}>심컴</button>
            <button onClick={() => navigate("/checker", {state : studentGlosoft})}>글솦</button>
            <button onClick={() => navigate("/checker", {state : studentInmcom})}>인컴</button>
        </div>
    )
}

export default Home;