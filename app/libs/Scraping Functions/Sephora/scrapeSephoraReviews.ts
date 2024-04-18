import { Page } from "puppeteer";

import { OptionProps } from "../../types";
import { Review } from "@prisma/client";

export async function scrapeSephoraReviews(page: Page, options: OptionProps) {
	const reviewData = await page.evaluate((options) => {
		const {
			reviewListContSelector,
			reviewContSelector,
			headlineSelector,
			reviewTextSelector,
			reviewDateSelector,
			reviewerNameSelector,
			ratingSelector,
			verifiedBuyerSelector,
			upVoteSelector,
		} = options;

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

		function getReviewTimeStamp(dateString: string | null): Date | null {
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

			let reviewDate: Date | null = null;
			if (mdh === "h") {
				reviewDate = new Date(
					currentDate.setHours(
						currentDate.getHours() - parseInt(count)
					)
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

		const reviewListContainer = document.querySelector(
			"#ratings-reviews-container"
		);

		if (!reviewListContainer) return [];

		const reviewContChild = reviewListContainer.querySelector(
			".css-1l6ttej.eanm77i0"
		);

		if (!reviewContChild) return [];

		const reviews = reviewContChild?.querySelectorAll(reviewContSelector);

		const result: Review[] = [];

		reviews?.forEach((review: Element) => {
			const reviewId = crypto.randomUUID();
			const productId = crypto.randomUUID();

			const headerEl =
				review.querySelector<HTMLHeadingElement>(headlineSelector);
			const header = headerEl ? headerEl.textContent : null;

			const reviewEl = review.querySelector(reviewTextSelector);
			const reviewText = reviewEl
				? (reviewEl as HTMLDivElement).textContent
				: null;

			const ratingEl = review
				.querySelector(ratingSelector)
				?.getAttribute("aria-label");
			const rating = ratingEl ? parseInt(ratingEl || "0") : null;

			const reviewDateEl =
				review.querySelector<HTMLSpanElement>(reviewDateSelector);
			const reviewDateText = reviewDateEl
				? getReviewTimeStamp(reviewDateEl.textContent)
				: null;

			const reviewNameEl =
				review.querySelector<HTMLAnchorElement>(reviewerNameSelector);
			const reviewNameText = reviewNameEl
				? reviewNameEl.textContent
				: null;

			const verifiedBuyerEl = review.querySelector(verifiedBuyerSelector);
			const verifiedBuyer = verifiedBuyerEl !== null;

			const voteEls =
				review.querySelectorAll<HTMLButtonElement>(upVoteSelector);

			let upVoteText: number | null = null;
			let downVoteText: number | null = null;

			if (voteEls.length === 2) {
				upVoteText = getNumber(
					voteEls[0].querySelector("span")?.textContent || ""
				);
				downVoteText = getNumber(
					voteEls[1].querySelector("span")?.textContent || ""
				);
			}

			result.push({
				review_id: reviewId,
				product_id: productId,
				retailer_id: "Sephora123",
				review_headline: header,
				review_text: reviewText,
				review_rating: rating,
				review_date: reviewDateText,
				reviewer_name: reviewNameText,
				reviewer_id: crypto.randomUUID(),
				verified_buyer: verifiedBuyer,
				up_votes: upVoteText,
				down_votes: downVoteText,
				query_id: crypto.randomUUID()
			});
		});

		return result;
	}, options.reviewSelector);
	return reviewData;
}
