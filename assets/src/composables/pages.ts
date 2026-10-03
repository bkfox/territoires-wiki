
/** Fetch the list of extracts for the pages of provided titles **/
export async function fetchExtracts(titles: string[], chars = 200): Promise<Record<string, string>> {
    const extracts: Record<string, string> = {}

    for(let index = 0; index < titles.length; index += 20) {
        const batch = titles.slice(index, index + 20)
        const params = new URLSearchParams({
            action: "query",
            prop: "extracts",
            titles: batch.join("|"),
            exintro: "1",
            explaintext: "1",
            exchars: String(chars),
            exlimit: "20",
            format: "json",
            formatversion: "2",
        })

        const response = await fetch(`${mw.config.get("wgScriptPath")}/api.php?${params}`)
        if(!response.ok)
            throw new Error(`MediaWiki API error: ${response.status}`)

        const data = await response.json()

        for(const page of data.query?.pages ?? [])
            extracts[page.title] = page.extract ?? ""
    }

    return extracts
}

