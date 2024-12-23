// Screen Swapper pour KWin avec gestion des écrans de tailles différentes
class WindowState {
    constructor(client) {
        this.geometry = client.geometry;
        this.isFullScreen = client.fullScreen;
        this.isMinimized = client.minimized;
        this.screen = workspace.clientArea(KWin.PlacementArea, client).screen;
    }
}

class ScreenSwapper {
    constructor() {
        this.screens = workspace.numScreens;
    }

    getWindowsForScreen(screenId) {
        return workspace.clientList().filter(
            client => workspace.clientArea(KWin.PlacementArea, client).screen === screenId
        );
    }

    getScreenDimensions(screenId) {
        const area = workspace.clientArea(KWin.FullScreenArea, 0, screenId);
        return {
            x: area.x,
            y: area.y,
            width: area.width,
            height: area.height
        };
    }

    calculateScalingFactors(sourceScreen, targetScreen) {
        return {
            width: targetScreen.width / sourceScreen.width,
            height: targetScreen.height / sourceScreen.height
        };
    }

    adjustGeometryForScreen(geometry, sourceScreen, targetScreen, scaling) {
        // Calculer la position relative dans l'écran source (en pourcentage)
        const relativeX = (geometry.x - sourceScreen.x) / sourceScreen.width;
        const relativeY = (geometry.y - sourceScreen.y) / sourceScreen.height;

        // Calculer les nouvelles dimensions avec mise à l'échelle
        const newWidth = Math.round(geometry.width * scaling.width);
        const newHeight = Math.round(geometry.height * scaling.height);

        // Calculer la nouvelle position absolue dans l'écran cible
        const newX = Math.round(targetScreen.x + (relativeX * targetScreen.width));
        const newY = Math.round(targetScreen.y + (relativeY * targetScreen.height));

        return {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        };
    }

    saveWindowStates(windows) {
        return windows.map(client => ({
            client: client,
            state: new WindowState(client)
        }));
    }

    swapScreens() {
        if (this.screens < 2) return;

        // Obtenir les dimensions des écrans
        const screen1Dim = this.getScreenDimensions(0);
        const screen2Dim = this.getScreenDimensions(1);

        // Calculer les facteurs d'échelle pour chaque direction
        const scale1to2 = this.calculateScalingFactors(screen1Dim, screen2Dim);
        const scale2to1 = this.calculateScalingFactors(screen2Dim, screen1Dim);

        // Sauvegarder l'état des fenêtres pour chaque écran
        const screen1Windows = this.saveWindowStates(this.getWindowsForScreen(0));
        const screen2Windows = this.saveWindowStates(this.getWindowsForScreen(1));

        // Déplacer les fenêtres de l'écran 1 vers l'écran 2
        screen1Windows.forEach(({client, state}) => {
            if (state.isFullScreen) {
                client.fullScreen = false;
            }
            
            const newGeometry = this.adjustGeometryForScreen(
                state.geometry,
                screen1Dim,
                screen2Dim,
                scale1to2
            );
            
            client.geometry = newGeometry;
            
            if (state.isFullScreen) {
                client.fullScreen = true;
            }
        });

        // Déplacer les fenêtres de l'écran 2 vers l'écran 1
        screen2Windows.forEach(({client, state}) => {
            if (state.isFullScreen) {
                client.fullScreen = false;
            }
            
            const newGeometry = this.adjustGeometryForScreen(
                state.geometry,
                screen2Dim,
                screen1Dim,
                scale2to1
            );
            
            client.geometry = newGeometry;
            
            if (state.isFullScreen) {
                client.fullScreen = true;
            }
        });
    }
}

// Créer l'instance et enregistrer le raccourci
let swapper = new ScreenSwapper();
registerShortcut("SwapScreens", "Swap all windows between screens", "Meta+Ctrl+S",
    () => swapper.swapScreens()
);
