"use server";

import { runSephoraAllProductsScraper } from "../libs/Scraping Functions/Sephora-AllProducts/runSephoraAllProductsScraper";
import { AllProducts } from '../libs/types';

export async function getAllSephoraProducts(
	url: string | null,
	brandId: string
): Promise<AllProducts[]> {
	if (!url) return [];

	try {
		const allProducts = await runSephoraAllProductsScraper(url as string, {
			selectors: {
				allProductsContSelector: ".css-1322gsb",
				productCardContSelector: ".css-1qe8tjm",
				productNameSelector: ".ProductTile-name.css-h8cc3p.eanm77i0",
				productImageSelector: "picture.css-yq9732",
				brandNameSelector: ".css-ft3vv3.eanm77i0",
				productPriceSelector: ".css-1f35s9q",
				skuIdSelector: "string",
				avgRatingSelector: '[data-at="star_rating_style"]',
				totalReviewsSelector: '[data-at="review_count"]',
				pageLinkSelector: ".css-klx76",

				loadMoreSelector: ".css-1p9axos.eanm77i0",
				brandId: brandId,
			},
		});

		return allProducts;
	} catch (error) {
		console.log(error);

		return [];
	}
}
