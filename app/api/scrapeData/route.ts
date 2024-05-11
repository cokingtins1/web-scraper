import scrapeProducts from "@/app/libs/DashboardFunctions/scrapeProducts";
import scrapeSharedReviews from "@/app/libs/DashboardFunctions/scrapeSharedReviews";
import scrapeReviews from "@/app/libs/DashboardFunctions/scrapeSharedReviews";
import { ScrapeReturnMessage, scrapeSchema } from "@/app/libs/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	let start = new Date().getTime();
	let end: number = new Date().getTime();
	let scrapeIndex = "";

	let returnMessage: ScrapeReturnMessage = {
		message: {
			executionTime: `${(end - start) / 1000}`,
			scrapeIndex,
			error: "",
		},
	};
	const body = await req.json();

	const result = scrapeSchema.safeParse(body);
	let zodErrors = {};

	if (!result.success) {
		result.error.issues.forEach((issue) => {
			zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
		});
	}

	if (result.success === false) {
		return NextResponse.json(
			Object.keys(zodErrors).length > 0
				? { errors: zodErrors }
				: { success: { data: "data..." } }
		);
	}
	const { retailer, target, startIndex, endIndex, brandUrl } = result.data;

	if (brandUrl && !brandUrl.includes(retailer.toLowerCase())) {
		return NextResponse.json({
			message: {
				executionTime: `${(end - start) / 1000}`,
				scrapeIndex: "",
				errorMessage: "URL must be from the selected retailer",
			},
		});
	}

	console.log(result.data);

	if (result.data.target === "Products") {
		returnMessage = await scrapeProducts(result.data);
	} else if (result.data.target === "Reviews") {
		//scrapeSharedReviews
		//scrapeReviews
		if (result.data.retailer === "Shared") {
			returnMessage = await scrapeSharedReviews(result.data);
		}
	}

	return NextResponse.json({
		message: {
			executionTime: `${(end - start) / 1000}`,
			scrapeIndex: scrapeIndex,
		},
	});
}
