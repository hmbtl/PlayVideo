import React from 'react';
import {
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Text,
} from 'react-native';
import { dummy } from "@config"
let count = 0;
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

const recent = dummy.feed.data.recent;

function Item({ id, title, selected, onSelect }) {
    count++;
    console.log(count, id)

    return (
        <TouchableOpacity
            onPress={() => onSelect(id)}
            style={[
                styles.item,
                { backgroundColor: selected ? '#6e3b6e' : '#f9c2ff' },
            ]}
        >
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

export default function TestScreen() {
    const [selected, setSelected] = React.useState(new Map());

    const onSelect = React.useCallback(
        id => {
            const newSelected = new Map(selected);
            newSelected.set(id, !selected.get(id));

            setSelected(newSelected);
        },
        [selected],
    );
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                initialNumToRender={5}
                renderItem={({ item }) => (
                    <Item
                        id={item.id}
                        title={item.title}
                        selected={!!selected.get(item.id)}
                        onSelect={onSelect}
                    />
                )}
                keyExtractor={item => item.id}
                extraData={selected}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
