/**
 * PSYCHROMATTICA: PsychroEvents.js
 * VERSION: 1.1 (FINAL AUDITED - CLEAN)
 * ROLE: The Nerves (Event Bus / Pub-Sub System)
 * 
 * DESCRIPTION:
 * Facilitates decoupled communication between the UI, the Controller, and the Engines.
 * Modules 'subscribe' to topics they care about, and 'publish' data when things happen.
 */

// Central registry to hold all active subscriptions
const subscribers = {};

// Set to true during development to see all events in the browser console
const DEBUG_MODE = true; 

export const PsychroEvents = {
    
    /**
     * Subscribe to an event.
     * @param {string} eventName - The name of the event to listen for (e.g., 'STATE_UPDATED').
     * @param {function} callback - The function to run when the event happens.
     * @returns {function} A function that can be called to unsubscribe.
     */
    subscribe(eventName, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] =[];
        }
        
        // Add the callback to the array of listeners for this event
        subscribers[eventName].push(callback);
        
        // Return a convenient unsubscribe function
        return () => this.unsubscribe(eventName, callback);
    },

    /**
     * Publish an event to the system.
     * @param {string} eventName - The name of the event being broadcast.
     * @param {any} data - The payload/data attached to the event.
     */
    publish(eventName, data = {}) {
        if (DEBUG_MODE) {
            console.log(`[PsychroEvents] PUBLISHED: ${eventName}`, data);
        }

        // If no one is listening to this event, just return
        if (!subscribers[eventName]) {
            return;
        }

        // Trigger every callback that is listening for this event
        subscribers[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[PsychroEvents] ERROR in subscriber for ${eventName}:`, error);
            }
        });
    },

    /**
     * Remove a specific listener from an event.
     * @param {string} eventName - The name of the event.
     * @param {function} callback - The original function to remove.
     */
    unsubscribe(eventName, callback) {
        if (!subscribers[eventName]) return;

        // Filter out the callback we want to remove
        subscribers[eventName] = subscribers[eventName].filter(cb => cb !== callback);
        
        // Clean up memory if no one is listening anymore
        if (subscribers[eventName].length === 0) {
            delete subscribers[eventName];
        }
    },

    /**
     * Wipe all subscriptions. Useful for resetting the game or changing modes entirely.
     */
    clearAll() {
        for (let event in subscribers) {
            delete subscribers[event];
        }
        if (DEBUG_MODE) console.log("[PsychroEvents] All subscriptions cleared.");
    }
};