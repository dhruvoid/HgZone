/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
let coepCredentialless = false;
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) {
                        return response;
                    }

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy", coepCredentialless ? "credentialless" : "require-corp");
                    if (!coepCredentialless) {
                        newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
                    }
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    });
} else {
    (() => {
        const reloadedByCOI = window.sessionStorage.getItem("coiReloadedBySelf");
        window.sessionStorage.removeItem("coiReloadedBySelf");

        const coi = {
            shouldRegister: () => !reloadedByCOI,
            shouldDeregister: () => false,
            doCoep: () => true,
            coepCredentialless: () => false,
            quiet: false,
            ...window.coi,
        };

        if (coi.shouldRegister()) {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register(window.document.currentScript.src).then(
                    (registration) => {
                        coi.quiet || console.log("COOP/COEP Service Worker registered", registration.scope);
                        registration.addEventListener("updatefound", () => {
                            coi.quiet || console.log("Signalling reload for COOP/COEP update");
                            window.sessionStorage.setItem("coiReloadedBySelf", "true");
                            window.location.reload();
                        });
                        if (registration.active && !navigator.serviceWorker.controller) {
                            coi.quiet || console.log("Signalling reload for COOP/COEP activation");
                            window.sessionStorage.setItem("coiReloadedBySelf", "true");
                            window.location.reload();
                        }
                    },
                    (err) => {
                        coi.quiet || console.error("COOP/COEP Service Worker failed to register", err);
                    }
                );
            }
        }
    })();
}
