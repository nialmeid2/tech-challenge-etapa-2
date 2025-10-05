import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export interface ChartData {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string[],
        hoverOffset: number
    }[]
}


export default function BarChart({data} : {
    data: ChartData
}) {
    return <Bar data={data}/>
}

