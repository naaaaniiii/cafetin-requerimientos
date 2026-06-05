export default class Cl_sMockApi {
    static async get(url) {
        try {
            const resp = await fetch(url);
            return resp.ok ? await resp.json() : [];
        }
        catch {
            return [];
        }
    }
    static async post(url, data) {
        try {
            const resp = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return resp.ok ? await resp.json() : null;
        }
        catch {
            return null;
        }
    }
    static async put(url, data) {
        try {
            const resp = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            return resp.ok;
        }
        catch {
            return false;
        }
    }
    static async delete(url) {
        try {
            const resp = await fetch(url, { method: "DELETE" });
            return resp.ok;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=Cl_sMockApi.js.map