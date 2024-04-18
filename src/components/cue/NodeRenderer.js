import { h } from 'vue';
export default {
    props: {
        node: Function
    },
    setup(props) {
        return () => {
            return props.node || '';
        };
    }
};
