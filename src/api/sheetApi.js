export async function fetchSheet() {
  const res = await fetch(
    "https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet"
  )
  const data = await res.json()
  return data.data
}
