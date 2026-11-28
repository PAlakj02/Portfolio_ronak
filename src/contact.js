// Anything on the site can open the contact box with openContact().
export const openContact = () => window.dispatchEvent(new Event("open-contact"));
