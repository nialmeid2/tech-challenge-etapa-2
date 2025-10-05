import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

export interface ChartData {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string[],
        hoverOffset: number
    }[]
}


export default function PieChart({data} : {
    data: ChartData
}) {
    return <Pie data={data}/>
}

