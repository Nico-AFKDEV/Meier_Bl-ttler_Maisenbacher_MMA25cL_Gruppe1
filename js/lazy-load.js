/* 
   Lazy Load Video Script
   
   Dokumentation und Implementierung: Lazy Loading für Videos mit Intersection Observer
   
   Basiert auf W3Schools:
   https://www.w3schools.com/jsref/api_intersectionobserver.asp
   https://www.w3schools.com/html/html5_video.asp
   
   Was macht dieses Script?

   1. Es sucht nach allen Video-Elementen mit der Klasse "lazy-video"
   2. Es verwendet die Intersection Observer API um zu erkennen, wenn ein Video sichtbar wird
   3. Es lädt das Video nur, wenn der Benutzer sich dem Video nähert
   4. Das spart Bandbreite und macht die Seite schneller
   
  
*/

// Starte das Script wenn die Seite vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lazy Load Script geladen - initialisiere Video Lazy Loading');
    initLazyLoadVideos();
});

/**
 * Hauptfunktion für Lazy Loading Videos
 * 
 * Diese Funktion:
 * 1. Findet alle Videos mit der Klasse "lazy-video"
 * 2. Erstellt einen Intersection Observer
 * 3. Überwacht jeden Video-Container
 * 4. Lädt Videos wenn sie sichtbar werden
 */
function initLazyLoadVideos() {
    // Finde alle Videos mit der Klasse "lazy-video"
    const lazyVideos = document.querySelectorAll('.lazy-video');
    
    console.log(`${lazyVideos.length} Lazy Loading Video(s) gefunden`);
    
    // Wenn keine Videos gefunden, beende die Funktion
    if (lazyVideos.length === 0) {
        console.warn('Keine Videos mit Klasse "lazy-video" gefunden');
        return;
    }
    
    // Erstelle einen Intersection Observer
    // Der Observer erkennt, wenn ein Element in den sichtbaren Bereich kommt
    const videoObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            // entry.isIntersecting ist true wenn das Element sichtbar ist
            if (entry.isIntersecting) {
                loadVideo(entry.target);
                // Stoppe die Beobachtung nach dem Laden
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options für den Observer:
        // Margin: Lädt das Video 100px bevor es sichtbar wird
        rootMargin: '100px'
    });
    
    // Beobachte jedes Video
    lazyVideos.forEach(function(video) {
        videoObserver.observe(video);
    });
}

/**
 * Lädt ein Video
 * 
 * Diese Funktion:
 * 1. Nimmt den data-src Attribut (echte Video-URL)
 * 2. Setzt ihn in den src Attribut
 * 3. Startet das Preloading des Videos
 * 4. Gibt Feedback in der Console
 * 
 * Parameter:
 * video - Das HTML Video-Element
 */
function loadVideo(video) {
    console.log('Lade Video: ' + video.getAttribute('data-src'));
    
    // Hole die echte Video-URL aus dem data-src Attribut
    const videoSrc = video.getAttribute('data-src');
    
    // Prüfe ob data-src vorhanden ist
    if (!videoSrc) {
        console.error('Fehler: data-src Attribut nicht vorhanden!');
        return;
    }
    
    // Setze den src Attribut zum Laden des Videos
    video.src = videoSrc;
    
    // Zeige Ladeeffekt
    video.classList.add('loading');
    
    // Wenn das Video geladen wurde, entferne den Loading-Effekt
    video.addEventListener('canplay', function() {
        console.log('Video erfolgreich geladen: ' + videoSrc);
        video.classList.remove('loading');
        video.classList.add('loaded');
    }, {once: true}); // {once: true} = Event Listener wird nur einmal ausgelöst
    
    // Fehlerbehandlung wenn Video nicht geladen werden kann
    video.addEventListener('error', function() {
        console.error('Fehler beim Laden des Videos: ' + videoSrc);
        video.classList.remove('loading');
        video.textContent = 'Video konnte nicht geladen werden';
    }, {once: true});
    
    // Starte das Laden des Videos
    video.load();
}

// ============================================
// DOCUMENTATION / ERKLÄRUNG FÜR W3SCHOOLS
// ============================================

/*
LAZY LOADING MIT INTERSECTION OBSERVER - SCHRITT FÜR SCHRITT ERKLÄRUNG:

1. HTML SETUP:
   <video class="lazy-video" data-src="mein-video.mp4" controls></video>
   
   - Klasse "lazy-video": Damit kann das Script das Video finden
   - data-src: Speichert den echten Video-Pfad
   - Ohne src Attribut wird Video nicht sofort geladen

2. INTERSECTION OBSERVER API:
   Überwacht Elemente und erkennt wann sie sichtbar werden:
   
   new IntersectionObserver(callback, options)
   
   - callback: Funktion die aufgerufen wird wenn Element sichtbar wird
   - options: Einstellungen wie z.B. rootMargin

3. ROOTMARGIN:
   rootMargin: '100px'
   
   Bedeutet: Laden des Videos startet 100px bevor es sichtbar ist
   Das gibt dem Video Zeit zu laden bevor Nutzer es sieht

4. LOADINDUSTRY PROCESS:
   a) Page lädt - Videos werden NICHT geladen
   b) Nutzer scrollt
   c) Video kommt in Nähe (100px Margin)
   d) isIntersecting wird true
   e) loadVideo() Funktion wird aufgerufen
   f) src Attribut wird gesetzt
   g) Video wird geladen

5. EVENT LISTENER:
   - 'canplay': Video ist bereit zum Abspielen
   - 'error': Video konnte nicht geladen werden
   
   Mit {once: true} wird der Listener nach einmaligem Aufruf gelöscht

VORTEILE:
✓ Video wird nur geladen wenn Nutzer es wahrscheinlich sieht
✓ Spart Bandbreite
✓ Schnelleres initiiales Laden der Seite
✓ Bessere Performance auf mobilen Geräten
✓ Ressourceneffizienz

BROWSER KOMPATIBILITÄT:
✓ Chrome 51+
✓ Firefox 55+
✓ Safari 12.1+
✓ Edge 16+

DEBUGGING:
- Öffne Browser Developer Tools (F12)
- Gehe zu Console
- Scrolle zur Nico Seite
- Du wirst Nachrichten sehen wie:
  "1 Lazy Loading Video(s) gefunden"
  "Lade Video: ../img/rickroll.mp4"
  "Video erfolgreich geladen: ../img/rickroll.mp4"
*/
