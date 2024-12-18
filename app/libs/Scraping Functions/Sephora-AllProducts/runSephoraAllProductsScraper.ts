import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { AllProducts, AllProductsSelectors } from "../../types";

import { loadAllProducts } from "./loadAllProducts";
import { scrapeAllSephoraProducts } from "./scrapeAllSephoraProducts";

export async function runSephoraAllProductsScraper(
	url: string,
	options: AllProductsSelectors
): Promise<AllProducts[]> {
	puppeteer.use(StealthPlugin());

	try {
		const browser = await puppeteer.launch({
			headless: true,
		});
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
		});

		await page.goto(url);

		let loadMoreButton = await page.$(
			options.selectors.loadMoreSelector
		);
		await loadAllProducts(page, true)

		while (loadMoreButton) {
			await loadAllProducts(page, false);
			await page.click(options.selectors.loadMoreSelector);
			await loadAllProducts(page, true);

			loadMoreButton = await page.$(
				options.selectors.loadMoreSelector
			);
		}
		const data = await scrapeAllSephoraProducts(page, options);

		await browser.close();

		return data;
	} catch (error) {
		console.error("Error occurred:", error);
		return [];
	}
}
