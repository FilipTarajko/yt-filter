type Filter = {
    text: string;
    asFull: boolean;
    refersToTitle: boolean;
    refersToChannel: boolean;
    isOn: boolean;
}

type FilterSet = {
    name: string;
    filters: Filter[];
    currentMode: FilteringMode;
}