//
//  ARModelManager.m
//  RCTARKit
//
//  Created by Zehao Li on 8/12/17.
//  Copyright © 2017 HippoAR. All rights reserved.
//

#import "ARLightManager.h"
#import "RCTARKitNodes.h"
#import "RCTConvert+ARKit.h"

@implementation ARLightManager

RCT_EXPORT_MODULE()

/**
* takes a node
*/
RCT_EXPORT_METHOD(mount:(NSDictionary *)property node:(SCNNode *)node frame:(NSString *)frame) {
    NSLog(@"mount light"); 
    NSDictionary *lightProps = property[@"light"];
    NSString *something = lightProps[@"something"];  
    NSLog(@"value_something %@", something); 
    /*[node addChildNode:modelNode];
    [[RCTARKitNodes sharedInstance] addNodeToScene:node inReferenceFrame:frame];    

    //NSLog(@"mount light"); 
    //[node addChildNode:lightNode];
    SCNLight *light = [SCNLight light];
    light.color = [UIColor yellowColor];
    light.type = SCNLightTypeOmni;
    SCNNode *lightNode = [SCNNode node];
    lightNode.light = light;
    lightNode.position = SCNVector3Make(0, 10, 10);
    [scene.rootNode addChildNode:lightNode];



    [[RCTARKitNodes sharedInstance] addNodeToScene:node inReferenceFrame:frame];*/
}

@end
