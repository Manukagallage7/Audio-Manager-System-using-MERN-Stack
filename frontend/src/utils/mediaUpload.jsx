import { createClient } from "@supabase/supabase-js";

const anon_key = "sb_publishable_-tPNVUNf8FkkeqYmSjXTeg_gI42CkPk";
const supabaseUrl = "https://zgmhdqgtvkgacsygmcpo.supabase.co";

const supabase = createClient(supabaseUrl, anon_key)

export default function uploadMedia(file) {

    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file provided");
            return;
        }

        const timestamp = new Date().getTime();
        const fileName = timestamp + file.name;

        supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600', upsert: false })
            .then(() => {
                const publicUrl = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
                resolve(publicUrl);
            })
            .catch((err) => {
                reject(err);
            });
    });
}