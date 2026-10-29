/* Niagize connection settings for the BETA copy (/beta/): the DEV database, Supabase project "winga-dev" (Frankfurt).
   Live (the root shop and Boss app) uses project "winga"; see ../shared/config.js.
   Dev holds a full copy of live as of 29 Oct 2026; test freely here, nothing reaches real customers.
   The anon key is public by design: Row Level Security decides who can read or change what. */
window.WINGA_CONFIG = {
  url: "https://zgpaitukibhmikhazgvk.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncGFpdHVraWJobWlraGF6Z3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODA4NzUsImV4cCI6MjEwODg1Njg3NX0.YJVEpHWwCWjaJcX8a8Gi2UMesV2P7QmVf54EAoj5aZc"
  ,stage: "pilot"   // "pilot" = yellow dot, "production" = green dot
  ,google: false
  ,beta: true       // /beta/ copy
  ,env: "dev"       // shows a DEV tag in both apps
};
