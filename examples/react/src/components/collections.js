import React from 'react';
import CollectionNotFound from './notFound';
import Collection from './collection';
import config from '../config.json';

function Collections (props) {
    const found = props.collections.filter(collection => collection.mAuthorId === config['LOOKING_FOOR_COURSE_ID'])[0];

    return <React.Fragment>
        {found ? <Collection collection={found} /> : <CollectionNotFound />}
    </React.Fragment>
}


export default Collections;

