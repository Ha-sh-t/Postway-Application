export let currentPage = 1;
export const totalPages = 3;

export function setPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
}