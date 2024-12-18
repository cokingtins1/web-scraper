import React from "react";
import { Card } from "@/components/ui/card";

type Props = {
	num: number;
};

export default function PlaceholderCard({ num }: Props) {
	return (
		<Card className="grid place-content-center border-dashed border-2 h-[70px] lg:h-[121px]">
			<p className="text-slate-400">Product {num}</p>
		</Card>
	);
}
