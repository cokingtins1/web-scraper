import React from "react";

type Props = {};

export default function page({}: Props) {
	const string = "$20.99";
	function getNumber(text: string | null): number | null {
		if (!text) return null;
		const regex = /(\d{1,3}(,\d{3})*(\.\d+)?)/;
		const match = text.match(regex);

		if (!match) return null;

		let numberString = match[0].replace(/[^\d.]/g, "");
		if (numberString.includes(".")) {
			return parseFloat(numberString);
		} else {
			return parseInt(numberString, 10);
		}
	}

	function getSku(url: URL) {
		const searchParams = url.searchParams;
		const sku = searchParams.get("sku");
		return sku;
	}

	// const url = "https://www.sephora.com/product/tula-skincare-24-7-moisture-hydrating-day-night-cream-P475185?skuId=2500742&icid2=products%20grid:p475185:product"

	const url = null;

	// console.log(getSku(new URL(url)));

	// 5 h ago
	// 1 d ago,
	// 31 d ago
	// 17 Dec 2024
	// 17 Nov 2024
	// 17 Oct 2024
	// 17 Sep 2024
	// 17 Aug 2024
	// 17 Jul 2024
	// 17 Jun 2024
	// 17 May 2024
	// 17 Apr 2024
	// 17 Mar 2024
	// 17 Feb 2024
	// 17 Jan 2024

	function getReviewTimeStamp(dateString: string) {
		if (!dateString) return null;

		const currentDate = new Date();
		const dateParts = dateString.split(" ");

		const [count, mdh, trailer] = dateParts;

		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		let reviewDate;
		if (mdh === "h") {
			reviewDate = new Date(
				currentDate.setHours(currentDate.getHours() - parseInt(count))
			);
		} else if (mdh === "d") {
			reviewDate = new Date(
				currentDate.setDate(currentDate.getDate() - parseInt(count))
			);
		} else if (monthNames.includes(mdh)) {
			const monthIndex = monthNames.indexOf(mdh);
			reviewDate = new Date(
				parseInt(trailer),
				monthIndex,
				parseInt(count)
			);
		}

		return reviewDate;
	}

	console.log(getReviewTimeStamp("17 Jan 2024"));

	return <div>page</div>;
}
