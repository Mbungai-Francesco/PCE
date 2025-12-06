import { toast } from "sonner";
import { cn } from "./utils";

let toastImageId: number | string;

export const loadToast = (
	val: string,
	action?: string,
	num?: number,
	col?: string
) => {
	toast.dismiss();
	toastImageId = toast(
		<div className="">
			<p
				className={cn("text-lg font-semibold", col === "red" && "text-red-600")}
			>
				{val}
			</p>
		</div>,
		{
			// title:  <p>{action}</p> ,
			description: <p className="text-black/70 font-medium">{action}</p>,
			action: (
				<span
					className="relative flex size-3 bg-transparent ml-2"
					onClick={() => num && toast.dismiss(toastImageId)}
				>
					<span
						className={cn(
							"absolute inline-flex h-full w-full rounded-full opacity-75 bg-sky-400",
							col === "red" && "bg-red-400",
							col === "green" && "bg-green-400",
							!num && "animate-ping"
						)}
					></span>
					<span
						className={cn(
							"relative inline-flex size-3 rounded-full bg-sky-500",
							col === "red" && "bg-red-500",
							col === "green" && "bg-green-500"
						)}
					></span>
				</span>
			),
			style: {
				display: "flex",
				justifyContent: "space-between",
				border: 0,
			},
			duration: num ? num : Infinity,
			position: "bottom-right",
		}
	);
};

// export const loadToast = (
// 	val: string,
// 	action?: string,
// 	num?: number,
// 	col?: string
// ) => {
// 	toastImageId = toast(
// 		<p className={cn("text-lg font-semibold", col === "red" && "text-red-600")}>
// 			{val}
// 		</p>,
// 		{
// 			// title:  <p>{action}</p> ,
// 			description: <p className="text-black/70 font-medium">{action}</p>,
// 			action: (
// 				<span
// 					className="relative flex size-3 bg-transparent ml-2"
// 					onClick={() => toast.dismiss(toastImageId)}
// 				>
// 					<span
// 						className={cn(
// 							"absolute inline-flex h-full w-full rounded-full opacity-75 bg-sky-400",
// 							col === "red" && "bg-red-400",
// 							col === "green" && "bg-green-400",
// 							!num && "animate-ping"
// 						)}
// 					></span>
// 					<span
// 						className={cn(
// 							"relative inline-flex size-3 rounded-full bg-sky-500",
// 							col === "red" && "bg-red-500",
// 							col === "green" && "bg-green-500"
// 						)}
// 					></span>
// 				</span>
// 			),
// 			style: {
// 				backgroundColor: "#ffe2e2",
// 				top: "50%",
// 				border: 0,
// 			},
// 			duration: num ? num : Infinity,
// 			position: "top-left",
// 		}
// 	);
// };
