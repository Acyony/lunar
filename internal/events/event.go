package events

// EventType represents the type of event
type EventType string

const (
	EventTypeHTTP EventType = "http"
	// Future event types:
	// EventTypeCron EventType = "cron"
	// EventTypeCustom EventType = "custom"
)

// Event is the interface that all event types must implement
type Event interface {
	Type() EventType
}
